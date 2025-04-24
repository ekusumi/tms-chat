import { fileAsyncTransport, logger } from "react-native-logs";
import FileSystem from "react-native-fs";

class Logger {
  private static instance: Logger;
  private constructor() {}

  private log: any;

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
      Logger.instance.init();
    }
    return Logger.instance;
  }

  private init() {
    console.info("Initializing logger");
    this.log = logger.createLogger({
      severity: "debug",
      transport: fileAsyncTransport,
      transportOptions: {
        FS: FileSystem,
        fileName: `TMSChat_{date-today}.log`,
      },
    });
  }

  public debug(logMessage: string) {
    this.log.debug(logMessage);
    console.debug(logMessage);
  }

  public info(logMessage: string) {
    this.log.info(logMessage);
    console.info(logMessage);
  }

  public warn(logMessage: string) {
    this.log.warn(logMessage);
    console.warn(logMessage);
  }

  public error(logMessage: string) {
    this.log.error(logMessage);
    console.error(logMessage);
  }
}

const Log = {
  debug: (log: string) => {
    Logger.getInstance().debug(log);
  },

  info: (log: string) => {
    Logger.getInstance().info(log);
  },

  warn: (log: string) => {
    Logger.getInstance().warn(log);
  },

  error: (log: string) => {
    Logger.getInstance().error(log);
  },
};

export default Log;
