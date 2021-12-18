import { ApiStatus, ApiUrls, FetchResponseData } from '@/types';
import Bus from '@eventbus/eventbus';
import Events from '@eventbus/events';
import { fetchPost, fetchDelete } from '@request/request';

export default class MainPageModel {
    enable() {
        Bus.on(Events.EventAddFavReq, this.#handleAddFav);
        Bus.on(Events.EventRemoveFavReq, this.#handleRemoveFav);
    }

    #handleAddFav = (id: string) => {
        fetchPost(ApiUrls.Events + '/' + id + '/favourite', {},
            (data: FetchResponseData) => {
                const { status, json } = data;
                if (status === ApiStatus.Ok) {
                    if (json.status === ApiStatus.Ok) {
                        Bus.emit(Events.EventAddFavRes);
                    }
                }
            }
        );
    };

    #handleRemoveFav = (id: string) => {
        fetchDelete(ApiUrls.Events + '/' + id + '/favourite',
            (data: FetchResponseData) => {
                const { status, json } = data;
                if (status === ApiStatus.Ok) {
                    if (json.status === ApiStatus.Ok) {
                        Bus.emit(Events.EventRemoveFavRes);
                    }
                }
            }
        );
    };

    disable() {
        Bus.off(Events.EventAddFavReq, this.#handleAddFav);
        Bus.off(Events.EventRemoveFavReq, this.#handleRemoveFav);
    }
}
