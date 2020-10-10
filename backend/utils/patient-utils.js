const getNextStage = (stage) => {
    switch(stage) {
        case "scan":
            return "model";
        case "model":
            return "printing";
        case "printing":
            return "delivery";
        case "delivery":
            return "feedback";            
        default:
            throw new Error(`Could not find stage ${stage}!`);
    }
}

module.exports = {
    getNextStage,
};
