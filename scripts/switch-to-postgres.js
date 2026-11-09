const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const pgSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.postgresql.prisma');

if (!fs.existsSync(pgSchemaPath)) {
  console.error('Arquivo schema.postgresql.prisma não encontrado.');
  process.exit(1);
}

const pgContent = fs.readFileSync(pgSchemaPath, 'utf8');
fs.writeFileSync(schemaPath, pgContent, 'utf8');

console.log('✅ Prisma configurado com sucesso para PostgreSQL!');
console.log('Certifique-se de configurar a variável DATABASE_URL com a string de conexão postgresql://... no arquivo .env');
console.log('Em seguida, execute: npx prisma db push && npx prisma db seed');
