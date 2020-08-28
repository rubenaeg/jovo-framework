import _get from 'lodash.get';
import { Inputs, JovoRequest, Input } from 'jovo-core';

import { BixbyRequestJSON, SessionData, VivContext } from './Interfaces';

export class BixbyRequest implements JovoRequest {
  vivContext?: VivContext;
  // @ts-ignore
  sessionData: SessionData = {};
  intent: string | undefined;
  directive: string | undefined;
  inputs: { [key: string]: string } = {};

  toJSON() {
    return Object.assign({}, this);
  }

  static fromJSON(json: BixbyRequestJSON | string, query?: Record<string, string>): BixbyRequest {
    const bixbyJson: BixbyRequestJSON = typeof json === 'string' ? JSON.parse(json) : json;
    const request = new BixbyRequest();
    for (const [key, val] of Object.entries(bixbyJson)) {
      switch (key) {
        case '$vivContext':
          request.vivContext = val;
          break;
        case '_jovoContext':
          request.sessionData = _get(bixbyJson, `_jovoContext._sessionData`, {});
          break;
        default: {
          request.inputs[key] = val;
        }
      }
    }
    request.intent = _get(query, 'intent', 'LAUNCH');
    request.directive = _get(query, 'directive');

    return request;
  }

  getSessionAttributes(): SessionData {
    return this.sessionData;
  }

  getSessionData(): SessionData {
    return this.getSessionAttributes();
  }

  getDeviceName(): string | undefined {
    return this.vivContext!.device;
  }

  getUserId(): string {
    return this.vivContext!.bixbyUserId;
  }

  getAccessToken(): string | undefined {
    return undefined;
  }

  getLocale(): string {
    return this.vivContext!.locale;
  }

  getLanguage() {
    return this.getLocale();
  }

  isNewSession(): boolean {
    return Object.keys(this.sessionData).length === 0;
  }

  getTimestamp(): string {
    return '';
  }

  hasAudioInterface(): boolean {
    return true;
  }

  hasScreenInterface(): boolean {
    return true;
  }

  hasVideoInterface(): boolean {
    return false;
  }

  getSessionId(): string {
    return this.sessionData._id || this.vivContext!.sessionId;
  }

  getInputs(): Inputs {
    // parse every input into key,value, ...
    const inputs: Inputs = {};
    for (const [key, val] of Object.entries(this.inputs!)) {
      inputs[key] = {
        key: val,
        value: val,
      };
    }
    return inputs;
  }

  setInputs(inputs: Inputs) {
    for (const key of Object.keys(inputs)) {
      const input: Input = inputs[key];
      this.inputs[key] = input.key!;
    }

    return this;
  }

  getState() {
    const sessionData: SessionData = this.getSessionAttributes();
    return sessionData._state;
  }

  setSessionData(sessionData: SessionData) {
    return this.setSessionAttributes(sessionData);
  }

  setSessionAttributes(sessionData: SessionData) {
    if (this.getSessionAttributes()) {
      for (const key of Object.keys(sessionData)) {
        this.sessionData[key] = sessionData[key];
      }
    }

    return this;
  }

  // tslint:disable:no-any
  addSessionAttribute(key: string, value: any) {
    if (this.getSessionAttributes()) {
      this.sessionData[key] = value;
    }

    return this;
  }

  // tslint:disable:no-any
  addSessionData(key: string, value: any) {
    return this.addSessionAttribute(key, value);
  }

  addInput(key: string, value: string) {
    this.inputs[key] = value;
    return this;
  }

  setTimestamp(timestamp: string) {
    // TODO implement
    return this;
  }

  setLocale(locale: string) {
    // TODO implement
    return this;
  }

  setUserId(userId: string) {
    // TODO possible
    return this;
  }

  setAccessToken(accessToken: string) {
    // TODO necessary?
    return this;
  }

  setNewSession(isNew: boolean) {
    // TODO reset session id and session data?
    if (isNew) {
      this.sessionData = {
        _id: this.getSessionId(),
      };
    }

    return this;
  }

  setAudioInterface() {
    // TODO implement
    return this;
  }

  setScreenInterface(): this {
    // TODO implement
    return this;
  }

  setVideoInterface() {
    // TODO implement
    return this;
  }

  setState(state: string) {
    this.sessionData!._state = state;
    return this;
  }

  getIntentName(): string | undefined {
    return this.intent;
  }

  setIntentName(intentName: string): this {
    this.intent = intentName;
    return this;
  }
}
