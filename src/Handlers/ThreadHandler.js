import {
  ChannnelResolver,
  GuildResolver,
} from "../Utilities/Resolver_Utils.js";
import { ThreadBuilder } from "../Structures/Thread.js";
import { Client, Guild, GuildChannel, TextChannel, ThreadChannel } from "discord.js";

/**
 * @class ThreadHandler - Thread handlers for Discord API
 * @param {Client} Client Discord API Client from discord.js v13
 * @param {object} ThreadClassCreateOptions Default Options for Thread ThreadHandler
 */

export class ThreadHandler {
  static #ChannelInstancesNumber = 0;
  static #ThreadInstanceRecords = {};

  /**
   * @constructor
   * @param {Client} Client Discord API Client from discord.js v13
   * @param {Guild} guild Guild Resolve from Discord.js v13
   * @param {GuildChannel} channel Channel Resolve from Discord.js v13
   * @param {object} metadata Extra Stuff to check or Cache Data
   */

  constructor(
    Client,
    ThreadClassCreateOptions = {
      guild: undefined,
      channel: undefined,
      metadata: null,
    }
  ) {
    this.Client = Client;
    this.ChannelCode = ++ThreadHandler.#ChannelInstancesNumber;
    this.guild = GuildResolver(Client, ThreadClassCreateOptions.guild, {
      ifmessage: true,
    });
    this.channel = ChannnelResolver(Client, ThreadClassCreateOptions.channel, {
      type: `text`,
      ifmessage: true,
    });
    this.metadata = ThreadClassCreateOptions.metadata;
    ThreadHandler.#ThreadInstanceRecords[
      `'${ThreadHandler.#ChannelInstancesNumber}'`
    ] = [];
  }

  /**
   * @method GetNormalThread Get Thread information of Particular Channel or Message
   * @param {TextChannel} ChannelResolve Thread Channel or Discord Message variable
   * @returns {ThreadChannel} ThreadChannel - Thread Channel of a Single Channel , Fetched from discord.js v13
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
   * @returns {ThreadChannel} ThreadChannel - Thread Channel of a Single Channel , Fetched from Class Instance
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
   * @param {object} ThreadOptions Options to create Thread for Particular Server and Channel
   * @returns {object} ThreadInstance - ThreadInstance , Fetched from Class Instance .
   */

  async CreateThread(
    CreateThreadOptions = {
      channel: undefined,
      metadata: undefined,
      Type: `GUILD_PUBLIC_THREAD`,
      Name: undefined,
      Reason: undefined,
      AutoArchiveDuration: 0,
    }
  ) {
    const ThreadInstanceClass = new ThreadBuilder({
      Client: this.Client,
      guild: this.guild,
      channel: ChannnelResolver(
        this.Client,
        CreateThreadOptions.channel || this.channel,
        {
          type: `text`,
          ifmessage: true,
        }
      ),
      metadata: CreateThreadOptions
        ? CreateThreadOptions.metadata
        : this.metadata,
    });
    const ThreadInstance = await ThreadInstanceClass.create(
      CreateThreadOptions
    );
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
   * @param {Instance} ThreadInstance Unique Thread Instance for the Deletion
   * @param {object} DestroyOptions Options for Reason or Delay in Deletion
   * @returns {Boolean} Boolean true on Success or undefined on faliure
   */

  async DestroyThread(
    ThreadInstance,
    DestroyThreadOptions = {
      Delay: 0,
      Reason: undefined,
    }
  ) {
    var ThreadInstances = ThreadHandler.#CheckInstance(this.ChannelCode);
    if (ThreadInstances && ThreadInstances.length > 0) {
      var Thread = ThreadHandler.#GetInstance(
        ThreadInstances,
        1,
        ThreadInstance
      );
      const Success = await Thread.destroy(DestroyThreadOptions);
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
   * @returns {object} ThreadInstances - ThreadInstances , Fetched from Class Instance .
   */

  static #CheckInstance(ChannelCode) {
    const ThreadInstances =
      ThreadHandler.#ThreadInstanceRecords[`'${ChannelCode}'`];
    return ThreadInstances;
  }

  /**
   * @method #RemoveInstance private Method for Deletion of Thread Instance from the Class Cache
   * @param {object} ThreadInstances Array  of Thread Instances for Deletion from Cache
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
   * @param {object} ThreadInstances Array of Thread Instances (Cache Value)
   * @param {Number} Amount Amount of Instances fetch if not Instance mentioned
   * @param {object} Instance Exact Number of Thread Instance to Fetch
   * @returns {object} ThreadInstance - ThreadInstance , Fetched from Class Instance .
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
