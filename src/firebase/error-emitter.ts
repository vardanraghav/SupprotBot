import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type Events = {
  'permission-error': (error: FirestorePermissionError) => void;
};

// Node's EventEmitter is used here as a simple, well-tested event bus.
// It's a small dependency that works in the browser.
class TypedEventEmitter {
  private emitter = new EventEmitter();

  emit<T extends keyof Events>(event: T, ...args: Parameters<Events[T]>) {
    this.emitter.emit(event, ...args);
  }

  on<T extends keyof Events>(event: T, listener: Events[T]) {
    this.emitter.on(event, listener);
  }

  off<T extends keyof Events>(event: T, listener: Events[T]) {
    this.emitter.off(event, listener);
  }
}

export const errorEmitter = new TypedEventEmitter();
