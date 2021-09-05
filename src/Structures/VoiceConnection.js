import { joinVoiceChannel, getVoiceConnection } from '@discordjs/voice'
import { Client, Guild, StageChannel, VoiceChannel } from 'discord.js'
import { GuildResolver } from '../Utilities/Resolver_Utils.js'

/**
 * @class VoiceConnectionBuilder - VoiceConnectionInstanceBuilder for Voice Handler for discord.js v13
 */

export class VoiceConnectionBuilder {
  /**
   *
   * @param {Client} Client
   * @param {StageChannel | VoiceChannel} channel Voice or Stage Channel Type from discord.js v13
   * @param {Guild} Guild Discord Guild Collection
   * @param {object} Adaptar Guild Adapter for "@discordjs/voice"
   * @param {object} ConnectioneOptions Interface Options for Builder
   */

  constructor(
    Client,
    Channel,
    Guild,
    Adaptar,
    ConnectionInterfaceOptions = {
      LeaveOnEmpty: false,
      LeaveOnOnlyBot: false,
      LeaveOnOnlyUsers: false,
      LeaveDelay: 0,
      selfDeaf: false,
      selfMute: false,
    },
  ) {
    this.Client = Client
    this.ChannelId = Channel.id
    this.GuildId = Guild.id
    this.Adaptar = Adaptar || Guild.voiceAdapterCreator
    this.LeaveOnEmpty = ConnectionInterfaceOptions.LeaveOnEmpty
    this.LeaveOnOnlyBot = ConnectionInterfaceOptions.LeaveOnOnlyBot
    this.LeaveOnOnlyUsers = ConnectionInterfaceOptions.LeaveOnOnlyUsers
    this.LeaveDelay = ConnectionInterfaceOptions.LeaveDelay
    this.selfDeaf = ConnectionInterfaceOptions.selfDeaf
    this.selfMute = ConnectionInterfaceOptions.selfMute
  }

  /**
   * @method create Create method for Builder [ Creating Voice Connection for the Handler ]
   * @returns VoiceConnectionBuilder's Instance
   */

  create() {
    try {
      const VoiceConnection = joinVoiceChannel({
        channelId: this.ChannelId,
        guildId: this.GuildId,
        selfDeaf: this.selfDeaf ? true : false,
        selfMute: this.selfMute ? true : false,
        adapterCreator: Adaptar ? Adaptar : this.Adaptar,
      })
      this.VoiceConnection = VoiceConnection
      return this
    } catch (error) {
      throw Error(error)
    }
  }
  /**
   * @method get Getter method for Voice Connection at Present repsective to GuilId
   * @returns VoiceConnectionBuilder
   */

  get() {
    this.VoiceConnection = getVoiceConnection({ guildId: this.GuildId })
    const Guild = GuildResolver(this.Client, this.GuildId)
    if (Guild.me && Guild.me.voice && Guild.me.voice.channel) {
      this.ChannelId = Guild.me.voice.channel.id
    }
    return this
  }

  /**
   * @method disconnect Disconnect On-Going Connection from Discord API
   * @returns {Boolean} true if the Conenction Disconnect Successfull
   */

  disconnect() {
    if (!this.VoiceConnection)
      throw TypeError(`No Voice Connection found in Handler!`)
    const SuccessBooleanResult = this.VoiceConnection.disconnect()
    if (!SuccessBooleanResult)
      throw TypeError(`Voice Connection can't be disconnected!`)
    else return SuccessBooleanResult
  }

  /**
   * @method destroy Destroy On-Going Connection from Discord API
   * @param {Boolean} AdapterAvailable If Adapter should be avaliable after destruction
   * @returns {Boolean} true if the Conenction Destroy Successfull
   */

  destroy(AdapterAvailable = true) {
    if (!this.VoiceConnection)
      throw TypeError(`No Voice Connection found in Handler!`)
    const SuccessBooleanResult = this.VoiceConnection.destroy({
      adapterAvailable: AdapterAvailable,
    })
    if (!SuccessBooleanResult)
      throw TypeError(`Voice Connection can't be distroyed!`)
    else {
      this.VoiceConnection = null
      return true
    }
  }
}
