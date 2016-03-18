# generator-b2r

**Caution: wet paint**

Yo generator for a Spring Boot Application that delegates rendering to a 
ReactJS App running on a NodeJS process.

## Ingredients

- [Boot2React Spring Boot Starter](https://github.com/sthzg/boot2react-spring-boot-starter)

## Subgenerators

- `$ yo b2r:setupserver`  creates boilerplate for server app in `./server`
- `$ yo b2r:setupclient`  creates boilerplate for client app in `./client`
- `$ yo b2r:component`    subgen for a react component

## Specs

### Server

- Spring Boot 1.3.3
- Gradle build system
- Scala as primary language
- Server-side-rendering (isomorphic/universal)

### ReactJS (NodeJS and Browser App)

- NodeJS > 4
- Webpack (HMR during development)
- Babel (still < 6)
- ReactJS 14.7
- ImmutableJS
- Intl
- AltJS
- React Router
