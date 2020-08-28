import _get from 'lodash.get';
import { JovoResponse, SpeechBuilder } from 'jovo-core';

import { Response, SessionData, Dialog } from './Interfaces';
import { BixbyAudioPlayer } from '../modules/BixbyAudioPlayer';

export class BixbyResponse implements Response, JovoResponse {
  _sessionData: SessionData = {
    _id: '',
  };
  _speech: Dialog = {
    speech: '',
    text: '',
  };
  _reprompt: Dialog = {
    speech: '',
    text: '',
  };
  _audio?: BixbyAudioPlayer;
  // tslint:disable:no-any
  _layout?: { [key: string]: any };
  _shouldEndSession: boolean = true;

  static fromJSON(jsonRaw: Response | string) {
    const json = typeof jsonRaw === 'string' ? JSON.parse(jsonRaw) : jsonRaw;
    const response = Object.create(BixbyResponse.prototype);
    return Object.assign(response, json);
  }

  setSessionId(id: string) {
    if (!this._sessionData) {
      this._sessionData = {
        _id: '',
      };
    }
    this._sessionData._id = id;
    return this;
  }

  getSessionId(): string | undefined {
    if (this._sessionData) {
      return this._sessionData._id;
    }
  }

  getSpeech(): string | undefined {
    return this._speech.speech;
  }

  getReprompt(): string | undefined {
    return this._reprompt.speech;
  }

  getSpeechPlain(): string | undefined {
    return this._speech.text;
  }

  getRepromptPlain(): string | undefined {
    return this._reprompt.text;
  }

  getSessionAttributes(): SessionData | undefined {
    return this._sessionData;
  }

  setSessionAttributes(sessionAttributes: SessionData): this {
    this._sessionData = sessionAttributes;
    return this;
  }

  getSessionData(): SessionData | undefined {
    return this.getSessionAttributes();
  }

  setSessionData(sessionData: SessionData): this {
    return this.setSessionAttributes(sessionData);
  }

  isTell(speechText?: string | string[] | undefined): boolean {
    if (speechText) {
      const ssml: string = this._speech.speech;

      if (Array.isArray(speechText)) {
        for (const speechTextElement of speechText) {
          if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
            return true;
          }
        }
        return false;
      } else {
        if (ssml !== SpeechBuilder.toSSML(speechText)) {
          return false;
        }
      }
    }

    return this._shouldEndSession;
  }

  isAsk(
    speechText?: string | string[] | undefined,
    repromptText?: string | string[] | undefined,
  ): boolean {
    if (speechText) {
      const ssml: string = this._speech.speech;

      if (Array.isArray(speechText)) {
        for (const speechTextElement of speechText) {
          if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
            return true;
          }
        }
        return false;
      } else {
        if (ssml !== SpeechBuilder.toSSML(speechText)) {
          return false;
        }
      }
    }

    if (repromptText) {
      const ssml: string = this._reprompt.speech;

      if (Array.isArray(repromptText)) {
        for (const speechTextElement of repromptText) {
          if (SpeechBuilder.toSSML(speechTextElement) === ssml) {
            return true;
          }
        }
        return false;
      } else {
        if (ssml !== SpeechBuilder.toSSML(repromptText)) {
          return false;
        }
      }
    }

    return !this._shouldEndSession;
  }

  hasState(state: string): boolean | undefined {
    return state === _get(this, '_sessionData._state');
  }

  getSessionAttribute(key: string): string | undefined {
    return _get(this, `_sessionData.${key}`);
  }

  // tslint:disable:no-any
  hasSessionAttribute(name: string, value?: any): boolean {
    const sessionAttribute = this.getSessionAttribute(name);
    if (value && sessionAttribute === value) {
      return true;
    }
    return false;
  }

  // tslint:disable:no-any
  hasSessionData(name: string, value?: any): boolean {
    return this.hasSessionAttribute(name, value);
  }

  hasSessionEnded(): boolean {
    return this._shouldEndSession;
  }
}
