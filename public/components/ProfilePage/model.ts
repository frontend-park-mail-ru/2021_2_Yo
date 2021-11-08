import {ApiUrls, EventData, FetchResponseData, UserData} from '@/types';
import {fetchGet, fetchPost, fetchPostMultipart} from '@request/request';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import UserStore from '@modules/userstore';

type MultipartData = {
    input: Map<string, { errors: string[], value: string }>,
    file?: File,
};

export default class ProfilePageModel {
    getUser(userId: string) {
        fetchGet(ApiUrls.User + '/' + userId, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const user = json.body as UserData;
                    Bus.emit(Events.UserByIdRes, user);
                    return;
                }
            }
        });

    }

    // editUser(inputsData: Map<string, { errors: string[], value: string }>) {
    editUser(data: MultipartData) {
        const newUserInfo = {
            name: data['input'].get('name')?.value as string,
            surname: data['input'].get('surname')?.value as string,
            description: data['input'].get('selfDescription')?.value as string,
        };

        const stored = UserStore.get() as UserData;

        if (!data.file &&
            stored.name === newUserInfo.name &&
            stored.surname === newUserInfo.surname &&
            stored.description === newUserInfo.description) {
            Bus.emit(Events.UserEditRes, stored);
        } else {
            console.log('multipart?');
            stored.name = newUserInfo.name;
            stored.surname = newUserInfo.surname;
            stored.description = newUserInfo.description;

            fetchPostMultipart(ApiUrls.User + '/info', {json: stored, file: data['file']}, (data: FetchResponseData) => {
                const {status, json} = data;
                if (status === 200) {
                    if (json.status === 200) {
                        Bus.emit(Events.UserReq);
                        Bus.emit(Events.UserEditRes, stored);
                        Bus.emit(Events.UserRes, stored);
                        return;
                    }
                }
            });
        }
    }

    editPassword(password: string) {
        fetchPost(ApiUrls.User + '/password', {password}, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const stored = UserStore.get() as UserData;
                    Bus.emit(Events.UserEditRes, stored);
                    return;
                }
            }
        });
    }

    getUserEvents(userId: string) {
        fetchGet(ApiUrls.Events + '?authorid=' + userId, (data: FetchResponseData) => {
            const {status, json} = data;
            if (status === 200) {
                if (json.status === 200) {
                    const events = json.body.events as EventData[];
                    Bus.emit(Events.EventsRes, events);
                    return;
                }
            }
        });
    }
}
