import { HttpLoggerMiddleware } from './http-logger.middleware';
import { Request, Response, NextFunction } from 'express';
import { EventEmitter } from 'events';

describe('HttpLoggerMiddleware', () => {
  let middleware: HttpLoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response> & EventEmitter;
  let nextFunction: NextFunction;

  beforeEach(() => {
    middleware = new HttpLoggerMiddleware();
    mockRequest = {
      headers: {},
      ip: '127.0.0.1',
      method: 'GET',
      originalUrl: '/api/v1/test',
      get: jest.fn().mockImplementation((headerName: string) => {
        if (headerName.toLowerCase() === 'user-agent') {
          return 'TestAgent/1.0';
        }
        return undefined;
      }),
    };

    const emitter = new EventEmitter();
    mockResponse = Object.assign(emitter, {
      statusCode: 200,
      writableEnded: true,
      setHeader: jest.fn(),
      get: jest.fn().mockReturnValue('100'),
    });

    nextFunction = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should set x-request-id and call next()', () => {
    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      expect.any(String),
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should reuse x-request-id header if supplied', () => {
    mockRequest.headers = { 'x-request-id': 'custom-req-id-123' };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.setHeader).toHaveBeenCalledWith(
      'x-request-id',
      'custom-req-id-123',
    );
  });

  it('should log 2xx responses on finish', () => {
    const loggerSpy = jest
      .spyOn(
        (middleware as unknown as { logger: { log: () => void } }).logger,
        'log',
      )
      .mockImplementation(() => {});

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    mockResponse.emit('finish');

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/v1/test 200'),
    );
  });

  it('should warn on 4xx status codes', () => {
    mockResponse.statusCode = 404;
    const warnSpy = jest
      .spyOn(
        (middleware as unknown as { logger: { warn: () => void } }).logger,
        'warn',
      )
      .mockImplementation(() => {});

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    mockResponse.emit('finish');

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/v1/test 404'),
    );
  });

  it('should log error on 5xx status codes', () => {
    mockResponse.statusCode = 500;
    const errorSpy = jest
      .spyOn(
        (middleware as unknown as { logger: { error: () => void } }).logger,
        'error',
      )
      .mockImplementation(() => {});

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    mockResponse.emit('finish');

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('GET /api/v1/test 500'),
    );
  });

  it('should log error if connection closes prematurely', () => {
    mockResponse.writableEnded = false;
    const errorSpy = jest
      .spyOn(
        (middleware as unknown as { logger: { error: () => void } }).logger,
        'error',
      )
      .mockImplementation(() => {});

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    mockResponse.emit('close');

    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Closed Prematurely'),
    );
  });
});
