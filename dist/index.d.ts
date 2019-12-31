import 'reflect-metadata';
import server, { use, useIntercept } from './server';
import { defineRoute } from './lib/connect';
import { Controller, Service, Get, Post, Interceptors } from './decorator';
export { use, useIntercept, defineRoute, Controller, Service, Get, Post, Interceptors };
export default server;
