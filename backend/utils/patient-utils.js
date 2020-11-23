const getNextStage = (stage) => {
    switch(stage) {
        case "scan":
            return "model";
        case "model":
            return "printing";
        case "printing":
            return "post_processing";
        case "post_processing":
            return "delivery";
        case "delivery":
            return "feedback";            
        default:
            throw new Error(`Could not find stage ${stage}!`);
    }
}
const getPrevStage = (stage) => {
    switch(stage) {
        case "feedback":
            return "delivery";
        case "delivery":
            return "post_processing";
        case "post_processing":
            return "printing";
        case "printing":
            return "model";
        case "model":
            return "scan";            
        default:
            throw new Error(`Could not find stage ${stage}!`);
    }
}

module.exports = {
    getNextStage,
    getPrevStage
};
