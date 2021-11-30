enum Events {
    // Route
    RouteBack = 'route:back',
    RouteUrl = 'route:url',
    RouteUpdate = 'route:update',
    RouteChange = 'reoute:change',

    // User
    UserRes = 'user:response',
    UserError = 'user:error',
    UserReq = 'user:request',
    UserEditReq = 'user-edit:request',
    UserPasswordEditReq = 'user-password-edit:request',
    UserPasswordEditRes = 'user-password-edit:response',
    UserByIdRes = 'user-by-id:response',
    UserIsSubscribedReq = 'user-subscribed:request',
    UserIsSubscribedRes = 'user-subscribed:response',

    // Events
    EventsReq = 'events:request',
    EventsRes = 'events:response',
    EventsStoredReq = 'events-stored:request',
    EventsStoredRes = 'events-stored:response',
    EventsResFav = 'events-favourite:response',
    EventsReqFav = 'events-favourite:request',
    EventsError = 'events:error',
    EventRes = 'event:response',
    EventCreateReq = 'event:create',
    EventCreated = 'event:created',
    EventEditReq = 'event:edit-request',
    EventDelete = 'event:delete',
    EventAddFavReq = 'event-addfav:request',
    EventAddFavRes = 'event-addfav:response',
    EventRemoveFavReq = 'event-removefav:request',
    EventRemoveFavRes = 'event-removefav:response',
    EventFavRes = 'event-fav:response',
    EventFavReq = 'event-fav:request',
    EventAuthorRes = 'event-author:response',

    // Authorization
    UserLogout = 'user:logout',
    UserSignup = 'user:signup',
    UserAuthorized = 'user:authorized',
    AuthError = 'auth:error',
    ValidationError = 'validation:error',
    ValidationOk = 'validation:ok',
    SubmitLogin = 'submit:login',

    // Search
    FilterChange = 'filter:change',
    QueryChange = 'query:change',

    // CSRF
    CSRFRes = 'csrf:response',
    CSRFDelete = 'csrf:delete',

    // Subscriptions
    SubscribersReq = 'user-subscribers:request',
    SubscriptionsReq = 'user-subscriptions:request',
    SubscribersRes = 'user-subscribers:response',
    SubscriptionsRes = 'user-subscriptions:response',
    SubscribeReq = 'subscribe:request',
    SubscribeRes = 'subscribe:response',
    UnsubscribeReq = 'unsubscribe:request',
    UnsubscribeRes = 'unsubscribe:response',

    // City Store
    CitiesRes = 'cities:request',
    CityAdd = 'city:add',
}

export default Events;
