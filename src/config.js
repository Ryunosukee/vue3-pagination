export default () => {
    return {
        format: true,
        chunk: 10,
        chunksNavigation: 'fixed',
        edgeNavigation: false,
        theme: 'tailwind',
        template: null,
        hideCount: false,
        texts: {
            count: 'Mostrando {from} a {to} de {count} registros|{count} registros|Un registro',
            first: 'Primero',
            last: 'Ultimo',
            nextPage: '>',
            nextChunk: '>>',
            prevPage: '<',
            prevChunk: '<<'
        }
    }
}
