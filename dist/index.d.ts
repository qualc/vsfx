import 'reflect-metadata';
import server, { use, useIntercept } from './server';
import { DefineRoute } from './lib/connect';
import { Controller, Get, Post } from './decorator';
export { use, useIntercept, DefineRoute, Controller, Get, Post };
export default server;
