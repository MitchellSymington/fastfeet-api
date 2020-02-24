import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import RecipientController from './app/controllers/RecipientController';
import OrderController from './app/controllers/OrderController';
import DeliveryController from './app/controllers/DeliveryController';
import HelperDeliveryController from './app/controllers/HelperDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import HelperDeliveryProblemController from './app/controllers/HelperDeliveryProblemController';
import DeliveryManController from './app/controllers/DeliveryManController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * Rotas Publicas
 */

/**
 * Loggin
 */
routes.post('/sessions', SessionController.store);

/**
 * Rotas para entregas
 */
routes.get('/deliveryman/:id/delivery?page', DeliveryController.index);
routes.put('/deliveryman/:id/start-delivery', DeliveryController.update);
routes.get('/deliveryman/:id/delivery?page', HelperDeliveryController.index);
routes.put('/deliveryman/:id/end-delivery', HelperDeliveryController.update);

/**
 * Rotas para o entregador cadastrar um problema
 */
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

/**
 * Rota para entrada do arquivos
 */
routes.post('/files', upload.single('file'), FileController.store);

/**
 * Rotas privadas
 */
routes.use(authMiddleware);

/**
 * Rotas para criar/atualizar/deletar admin
 */
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

/**
 * Rotas para atualizar/listar entregadores
 */
routes.put('/deliveryman/:id', DeliveryManController.update);
routes.get('/deliveryman', DeliveryManController.index);

/**
 * Rotas para criar/atualizar/deletar destinatarios
 */
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

/**
 * Rotas para criar produtos a serem entregues
 */
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

/**
 * Rotas para adminitrados listar problemas
 */
routes.get('/delivery/:id/problems', HelperDeliveryProblemController.index);
routes.get('/deliveries-problems', DeliveryProblemController.index);

/**
 * Rotas para adminitrados cancelar encomenda com problema
 */
routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);

export default routes;
