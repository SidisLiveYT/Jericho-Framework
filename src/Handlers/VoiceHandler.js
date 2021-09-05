import {
  ChannnelResolver,
  BooleanResolver,
} from '../Utilities/Resolver_Utils.js'
import { StageChannel, VoiceChannel, Client } from 'discord.js'
import { VoiceConnectionBuilder } from '../Structures/VoiceConnection.js'
import { Snowflake } from 'discord-api-types'

/**
 * @class VoiceHandler - Voice Handler for discord.js v13
 * @param {Client} Client Discord API Client from discord.js v13
 * @param {object} VoiceHandlerInterfaceOptions Voice handler Interface options for class VoiceHandler
 */

export class VoiceHandler {
  /**
   * @constructor VoiceHandler - Voice Handler for discord.js v13
   * @param {Client} Client Discord API Client from discord.js v13
   * @param {object} VoiceHandlerOptions Voice handler Interface options for class VoiceHandler
   */

  constructor(
    Client,
    VoiceHandlerInterfaceOptions = {
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false,
    },
  ) {
    this.Client = Client
    this.LeaveOnEmpty = VoiceHandlerInterfaceOptions.LeaveOnEmpty ? true : false
    this.LeaveOnOnlyBot = VoiceHandlerInterfaceOptions.LeaveOnOnlyBot
      ? true
      : false
    this.LeaveOnOnlyUsers = VoiceHandlerInterfaceOptions.LeaveOnOnlyUsers
      ? true
      : false
    this.LeaveDelay =
      VoiceHandlerInterfaceOptions.LeaveDelay > 0
        ? VoiceHandlerInterfaceOptions.LeaveDelay
        : 0
    this.selfDeaf = VoiceHandlerInterfaceOptions.selfDeaf ? true : false
    this.selfMute = VoiceHandlerInterfaceOptions.selfMute ? true : false

    /**
     * @event voiceStateUpdate Voice Update from discord.js v13
     * @param OldState old State in Voice Channel
     * @param NewState new State in Voice Channel
     */

    this.Client.on('voiceStateUpdate', (OldState, NewState) => {
      if (
        OldState &&
        !NewState &&
        OldState.member.id !== this.Client.user.id &&
        VoiceHandler.#GetVoiceConnection(OldState.guild.id)
      ) {
        const UserChecker = (member) => !member.user.bot
        const BotChecker = (member) => member.user.bot
        if (
          OldState.guild.me &&
          OldState.guild.me.voice &&
          OldState.guild.me.voice.channel &&
          OldState.guild.me.voice.channel.members &&
          OldState.guild.me.voice.channel.members.size <= 1 &&
          OldState.guild.me.voice.channel.members.has(`${Client.user.id}`) &&
          this.LeaveOnEmpty
        )
          return this.disconnect(OldState.guild.id, this.LeaveDelay)
        else if (
          OldState.guild.me &&
          OldState.guild.me.voice &&
          OldState.guild.me.voice.channel &&
          OldState.guild.me.voice.channel.members &&
          OldState &&
          OldState.guild.me.voice.channel.members.some(UserChecker) &&
          !OldState.guild.me.voice.channel.members.some(BotChecker) &&
          this.LeaveOnOnlyUsers
        )
          return this.disconnect(OldState.guild.id, this.LeaveDelay)
        else if (
          OldState.guild.me &&
          OldState.guild.me.voice &&
          OldState.guild.me.voice.channel &&
          OldState.guild.me.voice.channel.members &&
          OldState &&
          !OldState.guild.me.voice.channel.members.some(UserChecker) &&
          OldState.guild.me.voice.channel.members.some(BotChecker) &&
          this.LeaveOnOnlyBot
        )
          return this.disconnect(OldState.guild.id, this.LeaveDelay)
        else return void null
      } else if (
        NewState &&
        !OldState &&
        VoiceHandler.#GetVoiceConnection(NewState.guild.id)
      ) {
        const UserChecker = (member) => !member.user.bot
        const BotChecker = (member) => member.user.bot
        if (
          NewState.guild.me &&
          NewState.guild.me.voice &&
          NewState.guild.me.voice.channel &&
          NewState.guild.me.voice.channel.members &&
          NewState.guild.me.voice.channel.members.size <= 1 &&
          NewState.guild.me.voice.channel.members.has(`${Client.user.id}`) &&
          this.LeaveOnEmpty
        )
          return this.disconnect(NewState.guild.id, this.LeaveDelay)
        else if (
          NewState.guild.me &&
          NewState.guild.me.voice &&
          NewState.guild.me.voice.channel &&
          NewState.guild.me.voice.channel.members &&
          NewState &&
          NewState.guild.me.voice.channel.members.some(UserChecker) &&
          !NewState.guild.me.voice.channel.members.some(BotChecker) &&
          this.LeaveOnOnlyUsers
        )
          return this.disconnect(NewState.guild.id, this.LeaveDelay)
        else if (
          NewState.guild.me &&
          NewState.guild.me.voice &&
          NewState.guild.me.voice.channel &&
          NewState.guild.me.voice.channel.members &&
          NewState &&
          !NewState.guild.me.voice.channel.members.some(UserChecker) &&
          NewState.guild.me.voice.channel.members.some(BotChecker) &&
          this.LeaveOnOnlyBot
        )
          return this.disconnect(NewState.guild.id, this.LeaveDelay)
        else return void null
      }
    })
  }

  /**
   * @property {object} #VoiceConnectionRecords - Cache Value of Voice Connections
   */

  static #VoiceConnectionRecords = {}

  /**
   * @method join - Voice Handler for discord.js v13
   * @param {StageChannel | VoiceChannel} channel Discord API Client from discord.js v13
   * @param {object} JoinVoiceOptions Voice handler Interface options for class VoiceHandler
   * @return
   */

  async join(
    channel,
    JoinVoiceChannelOptions = {
      StageChannelTitle: `Voice Channel Handler - Jericho Framework`,
      debug: false,
      Adapter: null,
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false,
    },
  ) {
    if (!channel) throw SyntaxError(`Invalid Voice Type Channel is Detected !`)
    else channel = ChannnelResolver(this.Client, channel, { type: 'allvoice' })
    //Updating Class Properties
    JoinVoiceChannelOptions.LeaveOnEmpty = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    )
    JoinVoiceChannelOptions.LeaveOnOnlyBot = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    )
    JoinVoiceChannelOptions.LeaveOnOnlyUsers = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    )
    JoinVoiceChannelOptions.LeaveDelay =
      JoinVoiceChannelOptions.LeaveDelay > 0
        ? JoinVoiceChannelOptions.LeaveDelay
        : this.LeaveDelay
    JoinVoiceChannelOptions.selfDeaf = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    )
    JoinVoiceChannelOptions.selfMute = BooleanResolver(
      JoinVoiceChannelOptions.LeaveOnEmpty,
      this.LeaveOnEmpty,
    )

    const VoiceConnectionInstance = new VoiceConnectionBuilder(
      this.Client,
      channel,
      channel.guild,
      Adapter,
      {
        LeaveOnEmpty: this.LeaveOnEmpty,
        LeaveOnOnlyBot: this.LeaveOnOnlyBot,
        LeaveOnOnlyUsers: this.LeaveOnOnlyUsers,
        LeaveDelay: this.LeaveDelay,
        selfDeaf: this.selfDeaf,
        selfMute: this.selfMute,
      },
    )
    VoiceConnectionInstance = VoiceConnectionInstance.create()
    return VoiceHandler.#RegisterVoiceConnection(
      channel.guild.id,
      VoiceConnectionInstance,
    )
  }

  /**
   * @method disconnect Disconnect Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {Number} Delay Disconnect Delay in Number in Seconds
   * @returns {Boolean} true if Disconnect is Successfull
   */

  disconnect(GuildId, Delay = 0) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId)
    if (VoiceConnectionInstance && VoiceConnectionInstance.disconnect)
      throw Error(
        `[Connection is already Disconnected] : Please Connect to Channel`,
      )
    else if (!VoiceConnectionInstance)
      throw Error(
        `[Connection is already Destroyed] : Please Connect to Channel`,
      )
    if (Delay && Delay !== 0)
      return setTimeout(() => {
        return VoiceConnectionInstance.disconnect()
      }, Delay)
    else return VoiceConnectionInstance.disconnect()
  }

  /**
   * @method destroy Destroy Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {Boolean} AdapterAvailable Boolean Checker if Adaptar is Required
   */

  destroy(GuildId, AdapterAvailable = true) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId)
    if (VoiceConnectionInstance && VoiceConnectionInstance.disconnect)
      throw Error(
        `[Connection is already Disconnected] : Please Connect to Channel`,
      )
    else if (!VoiceConnectionInstance)
      throw Error(
        `[Connection is already Destroyed] : Please Connect to Channel`,
      )
    VoiceConnectionInstance.destroy(AdapterAvailable)
    return VoiceHandler.#DestroyVoiceConnection(GuildId)
  }

  /**
   * @method get Getter Method for Voice Connection on Discord Server
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  get(GuildId) {
    const VoiceConnectionInstance = VoiceHandler.#GetVoiceConnection(GuildId)
    if (!VoiceConnectionInstance)
      throw Error(
        `[Connection is already Destroyed] : Please Connect to Channel`,
      )
    return VoiceConnectionInstance.get()
  }

  /**
   * @method #RegisterVoiceConnection Registration of Voice Connection on handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   * @param {object} VoiceConnectionInstance Builder Class Instance for Cache
   */

  static #RegisterVoiceConnection(GuildId, VoiceConnectionInstance) {
    VoiceHandler.#VoiceConnectionRecords[
      `"${GuildId}"`
    ] = VoiceConnectionInstance
    return VoiceConnectionInstance.VoiceConnection
  }

  /**
   * @method #GetVoiceConnection Getter Private Method Voice Connection for Cache in Handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  static #GetVoiceConnection(GuildId) {
    const VoiceConnectionInstance =
      VoiceHandler.#VoiceConnectionRecords[`"${GuildId}"`]
    if (VoiceConnectionInstance) {
      VoiceConnectionInstance = VoiceConnectionInstance.get()
      VoiceHandler.#VoiceConnectionRecords[
        `"${GuildId}"`
      ] = VoiceConnectionInstance
    }
    return VoiceConnectionInstance
  }

  /**
   * @method #DestroyVoiceConnection Destroy Private Method Voice Connection for Cache in Handler Class
   * @param {Snowflake} GuildId Guild.id Snowflake for Getter Private method
   */

  static #DestroyVoiceConnection(GuildId) {
    VoiceHandler.#VoiceConnectionRecords[`"${GuildId}"`] = null
    return true
  }
}
