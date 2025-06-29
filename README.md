Nome e Número do Autor:

Autor: Maximo Dydyuk, nº 31818

Onde Está Publicado:

Frontend: https://trab1maximodydyuk.vercel.app/

Backend: https://trab1maximodydyuk.onrender.com

Na backend para ver alunos vemos: https://trab1maximodydyuk.onrender.com/api/alunos

Na backend para ver cursos vemos: https://trab1maximodydyuk.onrender.com/api/cursos

Como Instalar e Executar

Backend

Clonar o repositório:

git clone https://github.com/PWEB-2425/trab1-restapi-MaximoDydyuk.git

Instalar dependências:

cd trab1-restapi-MaximoDydyuk/backend

npm install

Executar o servidor:

node server.js

Frontend

Clonar o repositório:


git clone https://github.com/PWEB-2425/trab1-restapi-MaximoDydyuk.git

Instalar dependências:


cd trab1-restapi-MaximoDydyuk/frontend

npm install

Executar o servidor:


node server.js (na backend)

 Descrição da Base de Dados
 
O projeto utiliza uma base de dados em formato JSON para simular o armazenamento de dados. Esta abordagem é comum em ambientes de desenvolvimento e testes, 

permitindo uma configuração rápida e sem a necessidade de um servidor de banco de dados real. Também, posteriormente usamos o MOngodb. 

Descrição da API (Rotas)

A API RESTful implementada no backend oferece as seguintes rotas principais:

GET /api/items: Obtém todos os itens.

GET /api/items/:id: Obtém um item específico pelo ID.

POST /api/items: Cria um novo item.

PUT /api/items/:id: Atualiza um item existente pelo ID.

DELETE /api/items/:id: Remove um item pelo ID.


Estas rotas permitem operações CRUD (Criar, Ler, Atualizar, Deletar) sobre os itens na base de dados.

 Descrição do Frontend
 
O frontend foi desenvolvido utilizando HTML, CSS e JavaScript. Ele consome a API RESTful para exibir e manipular os dados dos itens. A interface é responsiva e 

permite ao utilizador interagir com os dados de forma intuitiva.

