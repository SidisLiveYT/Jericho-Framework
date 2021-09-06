/**
 * @class ThreadBuilder is the Class to Operate Particular Threads in Same Channel Respective Server
 * @param {object} ThreadBuilderCreateOptions Options Values for Particular Channel Instance
 * @returns {object} A Class Instance of Single Channel [ Unique Instance ]
 */

module.exports = class ThreadBuilder {
  /**
   * @property {Number} ThreadInstanceNumber : For Storing Instance Numbers for further Utils Requirements
   */

  static #ThreadInstanceNumber = 0

  /**
   * @constructor
   * @param ThreadBuilderCreateOptions Thread Bulder Options
   */

  constructor(
    ThreadBuilderCreateOptions = {
      Client: undefined,
      channel: undefined,
      guild: undefined,
      metadata: undefined,
    },
  ) {
    this.Client = ThreadBuilderCreateOptions.Client;
    this.ThreadCode = ThreadBuilder.#ThreadInstanceNumber + 1;
    this.channel = ThreadBuilderCreateOptions.channel;
    this.guild = ThreadBuilderCreateOptions.guild;
    this.metadata = ThreadBuilderCreateOptions.metadata;
    this.thread = null;
  }

  /**
   * @method CreateInstance Method for Creating Instance for the particular Channel
   * @param {object} CreateOptions Options for Name , AutoArchive Duration , Reason , Type .
   * @returns {object} Thread Instance for Thread-Handler Class .
   */

  async create(
    CreateThreadOptions = {
      channel: undefined,
      metadata: undefined,
      Type: 'GUILD_PUBLIC_THREAD',
      Name: undefined,
      Reason: undefined,
      AutoArchiveDuration: 0,
    },
  ) {
    if (!CreateThreadOptions) throw TypeError('Invalid Options Detected for Thread Creator');
    else if (
      CreateThreadOptions.Type
      && !['private', 'public'].includes(
        `${CreateThreadOptions.Type.toLowerCase().trim()}`,
      )
    ) throw TypeError('Invalid Thread Type is Detected!');
    const Thread = await this.channel.threads
      .create({
        name: CreateThreadOptions.Name
          ? CreateThreadOptions.Name
          : `Thread Instance - ${this.ThreadInstances + 1} | Jericho Framework`,
        autoArchiveDuration: CreateThreadOptions.AutoArchiveDuration
          ? CreateThreadOptions.AutoArchiveDuration
          : 60,
        type:
          CreateThreadOptions.Type === 'private'
            ? 'GUILD_PRIVATE_THREAD'
            : 'GUILD_PUBLIC_THREAD',
        reason: CreateThreadOptions.Reason
          ? CreateThreadOptions.Reason
          : `Thread Created by ${this.Client.user.name} on Thread Handler | Jericho Framework`,
      })
      .catch((error) => {
        throw error;
      });
    this.thread = Thread;
    return this;
  }

  /**
   * @method DestroyInstance Destroy Particular Instance Completely from Thread Class
   * @param {object} DestroyOptions Options for Delay Destroy and Reason
   * @returns {Boolean} ture/false Wheather the Condition is working
   */

  destroy(
    DestroyThreadOptions = {
      Delay: 0,
      Reason: undefined,
    },
  ) {
    if (!DestroyThreadOptions) {
      throw SyntaxError(
        "Options Variable can't be Undefined , Reason is Compulsory",
      );
    }
    if (
      DestroyThreadOptions.Delay
      && !Number.isNaN(DestroyThreadOptions.Delay)
      && DestroyThreadOptions.Reason
    ) {
      return setTimeout(
        ThreadDeletion(this.thread, DestroyThreadOptions.Reason),
        parseInt(DestroyThreadOptions.Delay) * 1000,
      );
    }
    if (DestroyThreadOptions.Reason) return ThreadDeletion(this.thread, DestroyThreadOptions.Reason);
    throw SyntaxError(
      "Options Variable can't be Undefined , Reason is Compulsory",
    );

    function ThreadDeletion(Thread, Reason) {
      return Thread.delete(`${Reason || 'Deleted Thread Instance}'}`)
        .then(() => true)
        .catch((error) => {
          throw error;
        });
    }
  }
};
