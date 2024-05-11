import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private _storage = localStorage;

    get(key: string, defaultValue?: string): any {
        return this._storage.getItem(key) || defaultValue;
    }

    del(key: string) {
        this._storage.removeItem(key);
    }

    set(key: string, value: string) {
        this._storage.setItem(key, value);
    }

    addPrefs(key: any, value: any): void {
        const pref = this._storage.getItem("preferences");
        let preferences: any = {};
        if (pref) {
            preferences = JSON.parse(pref);
        }
        preferences[key] = value;
        this._storage.setItem("preferences", JSON.stringify(preferences));
    }

    getPrefs(key: any, defaultValue?: string) {
        const pref = this._storage.getItem("preferences");
        let preferences: any = {};
        if (pref) {
            preferences = JSON.parse(pref);
            return preferences.hasOwnProperty(key) ? preferences[key] : defaultValue;
        }
        return defaultValue;
    }
}
