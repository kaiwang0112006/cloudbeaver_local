# CloudBeaver Community

<img src="https://github.com/dbeaver/cloudbeaver/wiki/images/cloudbeaver-logo.png" width="250"/>

Cloud Database Manager - Community Edition.  
CloudBeaver is a web server which provides rich web interface. Server itself is a Java application, web part is written on TypeScript and React.  
It is free to use and open-source (licensed under [Apache 2](https://github.com/dbeaver/cloudbeaver/blob/devel/LICENSE) license).  
See out [WIKI](https://github.com/dbeaver/cloudbeaver/wiki) for more details.  

![](https://github.com/dbeaver/cloudbeaver/wiki/images/demo_screenshot_1.png)

## Run in Docker

- [Official Docker repository](https://hub.docker.com/r/dbeaver/cloudbeaver)
- [Running instructions](https://github.com/dbeaver/cloudbeaver/wiki/Run-Docker-Container)

## Demo server

You can see live demo of CloudBeaver here: https://demo.cloudbeaver.io  

[Database access instructions](https://github.com/dbeaver/cloudbeaver/wiki/Demo-Server)

## Changelog

### CloudBeaver 1.2.3 - 2020-11-25

- New loading screen is added
- All connections and tabs are restored after re-login
- Active connections are highlighted in the Navigation tree
- Administration panel is improved:
    - Administration page is available when the general authentication is disabled (/#/admin)
    - Authentication and manual connections is enabled by default in the easy-configuration mode
- All notifications are redesigned
- A lot of minor UI fixes and improvements

### CloudBeaver 1.2.0 - 2020-10-19

- Docker environment support was added
- Filter panel was added in data editor
- User authentication and roles were added
- Administration panel was added:
    - Server management
    - Connection management
    - Automatic search of databases
    - User management
- A lot of minor fixes and improvements

### CloudBeaver 1.1.0 - 2020-07-14

- Connection management and authentication redesign
- Webpack build minimization
- A lot of minor UI improvements
- Many minor UI improvements

### CloudBeaver 1.0.4 - 2020-06-16

- Database navigator refresh
- Data viewer: filters support
- Many minor UI improvements

### CloudBeaver 1.0.3 - 2020-06-02

- Administrative panel
- User management
- Authentication model redesign
- Build artifacts minimization
- Many minor UI improvements

### CloudBeaver 1.0.2 - 2020-05-19

- Data export feature UI was improved
- User authentication and permission management
- Driver management was redesigned
- Clickhouse driver was added
- Build procedure was redesigned
- Many minor bugfixes

### CloudBeaver 1.0.1 - 2020-05-05

- Data export feature added to the data viewer
- H2 embedded database driver was added
- User authentication API was added
- Product configuration framework and API was added
- Embedded database for user management was added
- Many minor bugfixes
