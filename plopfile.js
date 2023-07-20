module.exports = function (plop) {
    plop.setGenerator('controller', {
        description: 'Create Controller File',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Input controller name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/server/controllers/{{dashCase name}}.controller.ts',
                templateFile: 'plop-templates/controller.hbs',
            },
            {
                type: 'modify',
                path: 'src/server/controllers/index.ts',
                pattern: '// -- Controller Import Port -- //',
                template: `import { {{pascalCase name}}Controller } from './{{dashCase name}}.controller'
// -- Controller Import Port -- //`,
            },
            {
                type: 'modify',
                path: 'src/server/controllers/index.ts',
                pattern: '// -- Controller Initiation Port -- //',
                template: `{{camelCase name}}Controller = new {{pascalCase name}}Controller()
    // -- Controller Initiation Port -- //`,
            },
        ],
    })
    plop.setGenerator('service', {
        description: 'Create Service File',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Input service name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/server/services/{{dashCase name}}.service.ts',
                templateFile: 'plop-templates/service.hbs',
            },
            {
                type: 'modify',
                path: 'src/server/services/index.ts',
                pattern: '// -- Service Import Port -- //',
                template: `import { {{pascalCase name}}Service } from './{{dashCase name}}.service'
// -- Service Import Port -- //`,
            },
            {
                type: 'modify',
                path: 'src/server/services/index.ts',
                pattern: '// -- Service Initiation Port -- //',
                template: `{{camelCase name}}Service = new {{pascalCase name}}Service()
    // -- Service Initiation Port -- //`,
            },
        ],
    })
    plop.setGenerator('repo', {
        description: 'Create Service File',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Input repository name',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'src/server/repositories/{{dashCase name}}.repository.ts',
                templateFile: 'plop-templates/repository.hbs',
            },
            {
                type: 'modify',
                path: 'src/server/repositories/index.ts',
                pattern: '// -- Repository Import Port -- //',
                template: `import { {{pascalCase name}}Repository } from './{{dashCase name}}.repository'
// -- Repository Import Port -- //`,
            },
            {
                type: 'modify',
                path: 'src/server/repositories/index.ts',
                pattern: '// -- Repository Initiation Port -- //',
                template: `{{camelCase name}}Repository = new {{pascalCase name}}Repository()
    // -- Repository Initiation Port -- //`,
            },
        ],
    })
}
