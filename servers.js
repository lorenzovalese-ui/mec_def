const Fastify = require('fastify');
const cors = require('@fastify/cors');
const postgres = require('postgres');

const sql = postgres({
    user: 'postgres',
    password: 'senai',
    host: 'localhost',
    port: 5432,
    database: 'mec_def'
});

const servidor = Fastify({
    logger: true
});

async function start() {

    await servidor.register(cors, {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    });

    // HOME
    servidor.get('/', async () => {
        return {
            sistema: 'Oficina Fácil',
            status: 'Online'
        };
    });

    // =====================
    // CLIENTES
    // =====================

    servidor.get('/clientes', async () => {

        const clientes = await sql`
            SELECT * FROM clientes
            ORDER BY id_cliente
        `;

        return clientes;
    });

    servidor.post('/clientes', async (request, reply) => {

        const { nome, senha, id_mecanico } = request.body;

        const cliente = await sql`
            INSERT INTO clientes (nome, senha, id_mecanico)
            VALUES (${nome}, ${senha}, ${id_mecanico})
            RETURNING *
        `;

        return reply.code(201).send(cliente[0]);
    });

    // LOGIN

    servidor.post('/login', async (request, reply) => {

        const { nome, senha } = request.body;

        const usuario = await sql`
            SELECT *
            FROM clientes
            WHERE nome = ${nome}
            AND senha = ${senha}
        `;

        if (usuario.length === 0) {
            return reply.code(401).send({
                mensagem: 'Usuário ou senha inválidos'
            });
        }

        return {
            mensagem: 'Login realizado com sucesso',
            usuario: usuario[0]
        };
    });

    // =====================
    // MECANICOS
    // =====================

    servidor.get('/mecanicos', async () => {

        return await sql`
            SELECT *
            FROM mecanicos
            ORDER BY id_mecanico
        `;
    });

    servidor.post('/mecanicos', async (request, reply) => {

        const { nome, contato } = request.body;

        const mecanico = await sql`
            INSERT INTO mecanicos (nome, contato)
            VALUES (${nome}, ${contato})
            RETURNING *
        `;

        return reply.code(201).send(mecanico[0]);
    });

    // =====================
    // CARROS
    // =====================

    servidor.get('/carros', async () => {

        return await sql`
            SELECT *
            FROM carros
            ORDER BY id_carro
        `;
    });

    servidor.post('/carros', async (request, reply) => {

        const { marca, problema, id_cliente } = request.body;

        const carro = await sql`
            INSERT INTO carros (marca, problema, id_cliente)
            VALUES (${marca}, ${problema}, ${id_cliente})
            RETURNING *
        `;

        return reply.code(201).send(carro[0]);
    });

    // =====================
    // SERVICOS
    // =====================

    servidor.get('/servicos', async () => {

        return await sql`
            SELECT *
            FROM servicos
            ORDER BY id_servico
        `;
    });

    servidor.post('/servicos', async (request, reply) => {

        const {
            descricao,
            data_servico,
            valor,
            status,
            id_carro
        } = request.body;

        const servico = await sql`
            INSERT INTO servicos (
                descricao,
                data_servico,
                valor,
                status,
                id_carro
            )
            VALUES (
                ${descricao},
                ${data_servico},
                ${valor},
                ${status},
                ${id_carro}
            )
            RETURNING *
        `;

        return reply.code(201).send(servico[0]);
    });

    await servidor.listen({
        port: 3000,
        host: '0.0.0.0'
    });

    console.log('Servidor rodando na porta 3000');
}

start();