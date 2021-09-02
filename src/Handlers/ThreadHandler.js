import {
  ChannnelResolver,
  GuildResolver,
} from "../Utilities/Resolver_Utils.js";
import { ThreadBuilder } from "../Structures/Thread.js";

/**
 * @class ThreadHandler - Thread handlers for Discord API
 * @param {Snowflake} Client Discord API Client from discord.js v13
 * @param {Object} Options Default Options for Thread ThreadHandler
 */

export class ThreadHandler {
  static #ChannelInstancesNumber = 0;
  static #ThreadInstanceRecords = {};

  /**
   * @constructor
   * @property {Snowflake} Client Discord API Client from discord.js v13
   * @property {Number} ChannelCode Thread-main Channel's Code for Instance get method
   * @property {Snowflake} guild Guild Resolve from Discord.js v13
   * @property {Snowflake} channel Channel Resolve from Discord.js v13
   * @property {Object} metadata Extra Stuff to check or Cache Data
   */

  constructor(Client, Options) {
    this.Client = Client;
    this.ChannelCode = ++ThreadHandler.#ChannelInstancesNumber;
    this.guild = GuildResolver(Client, Options.guild, {
      ifmessage: true,
    });
    this.channel = ChannnelResolver(Client, Options.channel, {
      type: `text`,
      ifmessage: true,
    });
    this.metadata = Options.metadata;
    ThreadHandler.#ThreadInstanceRecords[
      `'${ThreadHandler.#ChannelInstancesNumber}'`
    ] = [];
  }

  /**
   * @method GetNormalThread Get Thread information of Particular Channel or Message
   * @param {Snowflake} ChannelResolve Thread Channel or Discord Message variable
   * @returns {Snowflake} ThreadChannel - Thread Channel of a Single Channel , Fetched from discord.js v13
   */

  GetThread(ChannelResolve) {
    const ThreadChannel = ChannnelResolver(this.Client, ChannelResolve, {
      type: `thread`,
      ifmessage: true,
    });
    return ThreadChannel;
  }

  /**
   * @method GetThreadInstances Get Instance information of Particular Channel or Message
   * @param {Number} Instance Thread Channel or Discord Message variable
   * @param {Number} Amount Amount of Threads want to Recover from the Channel Instance
   * @returns {Snowflake} ThreadChannel - Thread Channel of a Single Channel , Fetched from Class Instance
   */

  GetThreadInstances(Instance, Amount) {
    const ThreadInstances = ThreadHandler.#CheckInstance(this.ChannelCode);
    if (ThreadInstances && ThreadInstances.length > 0) {
      var Thread = ThreadHandler.#GetInstance(
        ThreadInstances,
        Amount,
        Instance
      );
      return Thread;
    } else return void null;
  }

  /**
   * @method CreateThread Create Method method of the Channel Class
   * @param {Object} Options Options to create Thread for Particular Server and Channel
   * @returns {Object} ThreadInstance - ThreadInstance , Fetched from Class Instance .
   */

  async CreateThread(Options) {
    const ThreadInstanceClass = new ThreadBuilder({
      Client: this.Client,
      guild: this.guild,
      channel: ChannnelResolver(this.Client, Options.channel || this.channel, {
        type: `text`,
        ifmessage: true,
      }),
      metadata: Options ? Options.metadata : this.metadata,
    });
    const ThreadInstance = await ThreadInstanceClass.create(Options);
    var ThreadInstances =
      ThreadHandler.#ThreadInstanceRecords[`'${this.ChannelCode}'`];
    if (ThreadInstances) ThreadInstances.push(ThreadInstance);
    else ThreadInstances = [ThreadInstance];
    ThreadHandler.#ThreadInstanceRecords[`'${this.ChannelCode}'`] =
      ThreadInstances;
    return ThreadInstance;
  }

  /**
   * @method DestroyThread Destroying Thread from Cache and Thread Instances
   * @param {Object} ThreadInstance Unique Thread Instance for the Deletion
   * @param {Object} Options Options for Reason or Delay in Deletion
   * @returns {Boolean} Boolean true on Success or undefined on faliure
   */

  async DestroyThread(ThreadInstance, Options) {
    var ThreadInstances = ThreadHandler.#CheckInstance(this.ChannelCode);
    if (ThreadInstances && ThreadInstances.length > 0) {
      var Thread = ThreadHandler.#GetInstance(
        ThreadInstances,
        1,
        ThreadInstance
      );
      const Success = await Thread.destroy(Options);
      if (Success)
        return ThreadHandler.#RemoveInstance(
          ThreadInstances,
          ThreadInstance,
          this.ChannelCode
        );
      else return void null;
    } else return void null;
  }

  /**
   * @method #CheckInstance Private Method to Check Wheather Channel exist as Instance for Threads
   * @param {Number} ChannelCode Channel Instance Code present on Class Cache
   * @returns {Object} ThreadInstances - ThreadInstances , Fetched from Class Instance .
   */

  static #CheckInstance(ChannelCode) {
    const ThreadInstances =
      ThreadHandler.#ThreadInstanceRecords[`'${ChannelCode}'`];
    return ThreadInstances;
  }

  /**
   * @method #RemoveInstance private Method for Deletion of Thread Instance from the Class Cache
   * @param {Object} ThreadInstances Array  of Thread Instances for Deletion from Cache
   * @param {Number} Instance if its not all , then Number of Instance to delete
   * @param {Number} ChannelCode Channel Instance Code present on Class Cache
   * @returns {Boolean} True or False Depends
   */

  static #RemoveInstance(ThreadInstances, Instance, ChannelCode) {
    var count = 0;
    for (count = 0; count < ThreadInstances.length; ++count) {
      if (ThreadInstances[count].ThreadInstance === Instance) {
        ThreadInstances[count] = undefined;
        break;
      }
    }
    ThreadHandler.#ThreadInstanceRecords[`'${ChannelCode}'`] = ThreadInstances;
    return true;
  }

  /**
   * @method #GetInstance Private Static Method to get Thread Instance from the Cache
   * @param {Object} ThreadInstances Array of Thread Instances (Cache Value)
   * @param {Number} Amount Amount of Instances fetch if not Instance mentioned
   * @param {Object} Instance Exact Number of Thread Instance to Fetch
   * @returns {Object} ThreadInstance - ThreadInstance , Fetched from Class Instance .
   */
  static #GetInstance(ThreadInstances, Amount, Instance) {
    var count = 0;
    var choice = 0;
    var Threads = [];
    if (
      Instance &&
      typeof Instance === "string" &&
      Instance.toLowerCase().trim() === "all"
    )
      return ThreadInstances;
    for (count = 0; count < ThreadInstances.length; ++count) {
      if (Instance && ThreadInstances[count].ThreadCode === Instance)
        Threads.push(ThreadInstances[count]);
      else if (!Instance) Threads.push(ThreadInstances[count]);
      if (Amount && choice === Amount) break;
      else ++choice;
    }
    return Threads;
  }
}
