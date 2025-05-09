const logger = (req, res, next) => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    const yellow = '\x1b[33m';
    const blue = '\x1b[34m';
    const green = '\x1b[32m';
    const red = '\x1b[31m';
    const reset = '\x1b[0m';

    const originalSend = res.send;
    res.send = function (body) {
        const statusColor = (res.statusCode >= 200 && res.statusCode < 300) ? green : red;

        let responseMessage = "";
        try {
            const responseBody = typeof body === "string" ? JSON.parse(body) : body;
            responseMessage = responseBody && responseBody.message ? responseBody.message : "";
        } catch (error) {
            responseMessage = body ? body.toString() : "";
        }

        console.log(`
${blue}[${formattedDate}]${reset} 
${yellow}${req.method}${reset} ${req.url} ${statusColor}(${res.statusCode})${reset}
${blue}Params:${reset} ${yellow}${JSON.stringify(req.params || {})}${reset}
${blue}Queries:${reset} ${yellow}${JSON.stringify(req.query || {})}${reset}
${blue}Body:${reset} ${yellow}${JSON.stringify(req.body || {})}${reset}
${blue}Response Message: ${yellow}"${responseMessage}"${reset}
`);
        return originalSend.call(this, body);
    };

    next();
};

export default logger;