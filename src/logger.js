/* eslint-disable no-console */
function logger(priority, collectionName, command, content) {
    // define priority based on process.env.NODE_ENV
    const logLevel = Number(process.env.SERVER_LOGGER_LEVEL) || 4;
    let fullContent;
    if (priority <= logLevel) {
        if (typeof content === "object") {
            fullContent = `[${collectionName.toUpperCase()}] ${command} : ${JSON.stringify(content)}`;
        } else if (typeof content !== "object") {
            fullContent = `[${collectionName.toUpperCase()}] ${command} : ${content}`;
        }
        console.log(fullContent);
        return null;
    } else if (priority > logLevel) {
        return null;
    }
    throw new Error("INVALID_LOG", "Missing argument in logger");
}

module.exports = {
    logger,
};
