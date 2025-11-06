
# ==================================
# Stage 1: Builder
# ==================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação React com Vite
# A variável de ambiente será injetada no build
ARG VITE_URL_BACKEND=http://localhost:3000
ENV VITE_URL_BACKEND=$VITE_URL_BACKEND

RUN npm run build

# ==================================
# Stage 2: Production com Nginx
# ==================================
FROM nginx:alpine

# Copiar build do React para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]