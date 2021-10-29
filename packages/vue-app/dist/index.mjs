import path from 'path';

var dependencies = {
	"@wefly/vue-store-next": "^1.0.1",
	vue: "3.1.5",
	"vue-router": "4.0.10"
};

const template = {
    dependencies,
    dir: path.join(__dirname, '..', 'template'),
    files: [
        'App.vue',
        'main.ts',
        'entry-client.ts',
        'entry-server.ts',
        'router.ts',
        'store.ts'
    ]
};

export { template };
