let connexions = new Set();
let currentId = 0;

const sse = () => {
    return (request, response, next ) => {
        // initialisation du canal de transmission
        response.initStream = () => {
            response.status(200);
            response.header('Cache-Control', 'no-cache').header('Content-Type', 'text/event-stream')
            .header('Connection', 'keep-alive');

            //enregistrement des connection sur lesquels on doit dispatcher les données
            connexions.add(response)

            // boucle qui va envoyer de petit d'info pour garder ma connection en vie
            const intervalId = setInterval(() => {
                response.sse.send(':\n\n');
                // response.sse.send('SSE is active');
            }, 15000)

            response.once('close', () => {
                clearInterval(intervalId)
                response.end();
                connexions.delete(response)
                console.log('SSE Closed !!!')
            })

        }

        response.sendSSE = (data, eventName) => {
            let dataString =
                `id: ${currentId}\n` +
                `data: ${JSON.stringify(data)}\n` +
                (eventName ? `event: ${eventName}\n\n` : `\n`)

            for (let connexion of connexions) {
                connexion.send(dataString);               
            }

            currentId++;
        }

        next()
    }
}

module.exports = sse;
// export default sse;