export const onDebugMode = () => {
  return process.env.REACT_APP_DEVELOPEMENT_MODE === "true";
};

export const log = message => {
  if (onDebugMode()) {
    return console.log(message);
  } else {
    return null; //console.log("production ...");
  }
};

export const printEnvMode = () => {
  if (onDebugMode()) {
    return console.log("development mode ...");
  } else {
    return console.log("production mode ...");
  }
};

export const ENV_PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME;
export const ENV_PROJECT_AUTHOR = process.env.REACT_APP_PROJECT_AUTHOR;
