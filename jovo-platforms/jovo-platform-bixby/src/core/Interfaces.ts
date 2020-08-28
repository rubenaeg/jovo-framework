import { TestSuite } from 'jovo-core';
import { BixbyRequestBuilder } from './BixbyRequestBuilder';
import { BixbyResponseBuilder } from './BixbyResponseBuilder';

export interface VivContext {
  clientAppVersion: string;
  is24HourFormat: boolean;
  timezone: string;
  screenLocked: boolean;
  sessionId: string;
  locale: string;
  clientAppId: string;
  userId: string;
  canTypeId: string;
  handsFree: boolean;
  bixbyUserId: string;
  grantedPermissions: {
    'bixby-user-id-access': boolean;
  };
  device: string;
}

export interface BixbyRequestJSON {
  $vivContext: VivContext;
  // tslint:disable:no-any
  _jovoContext: any;
  // tslint:disable:no-any
  [key: string]: any;
}

export interface SessionData {
  _id: string;
  _state?: string;
  // tslint:disable:no-any
  [key: string]: any;
}

export interface Dialog {
  speech: string;
  text: string;
}

export interface Response {
  _speech: Dialog;
  _reprompt: Dialog;
  _sessionData: SessionData;
  _audio?: {};
}

export interface BixbyTestSuite extends TestSuite<BixbyRequestBuilder, BixbyResponseBuilder> {}
