CREATE TABLE mecanicos (
    id_mecanico SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(20) NOT NULL
);

CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    id_mecanico INT,

    FOREIGN KEY (id_mecanico)
    REFERENCES mecanicos(id_mecanico)
);

CREATE TABLE carros (
    id_carro SERIAL PRIMARY KEY,
    marca VARCHAR(255) NOT NULL,
    problema VARCHAR(255) NOT NULL,
    id_cliente INT,

    FOREIGN KEY (id_cliente)
    REFERENCES clientes(id_cliente)
);

CREATE TABLE servicos (
    id_servico SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    data_servico DATE NOT NULL,
    valor DECIMAL(10,2),
    status VARCHAR(50) NOT NULL,
    id_carro INT,

    FOREIGN KEY (id_carro)
    REFERENCES carros(id_carro)
);

INSERT INTO mecanicos (nome,contato) VALUES ('Marcos','9912-8234');

SELECT * FROM mecanicos;