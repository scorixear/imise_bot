export default class TwoWayMap<K, V>{
  private map: Map<K, V>
  private reverseMap: Map<V, K>
  constructor(map: Map<K, V>) {
    this.map = map;
    this.reverseMap = new Map();
    for(const key of map.keys()) {
      const value = map.get(key);
      if(value) {
        this.reverseMap.set(value, key);
      }
    }
  }
  set(key: K, value: V) {
    this.map.set(key, value);
    this.reverseMap.set(value, key);
  }

  get(key: K) {return this.map.get(key);}
  revGet(key: V) { return this.reverseMap.get(key);}
  typeGet(type: new(id: string) => V) {
    for(const key of this.reverseMap.keys()) {
      if(key instanceof type) {
        return this.revGet(key);
      }
    }
    return undefined;
  }

  find(action: (key: K)=>boolean) {
    for(const k of this.map.keys()) {
      if (action(k)) {
        return this.map.get(k);
      }
    }
    return undefined;
  }
}import { ButtonInteraction } from "discord.js";

abstract class ButtonInteractionHandle {
  public id: string;
  constructor(id: string) {
    this.id = id;
  }

  public async handle(interaction: ButtonInteraction) {
    // set interaction as handled
    setTimeout(async ()=> {
      try {
        await interaction.deferUpdate()
      } catch {}
    }, 2000);
  }
}

export {ButtonInteractionHandle}