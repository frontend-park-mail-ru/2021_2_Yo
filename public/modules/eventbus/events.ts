enum Events {
    // Route
    RouteBack = 'route:back',
    RouteUrl = 'route:url',
    RouteUpdate = 'route:update',

    // User
    UserRes = 'user:response',
    UserError = 'user:error',
    UserReq = 'user:request',
    UserEditReq = 'user-edit:request',
    UserPasswordEditReq = 'user-password-edit:request',
    UserPasswordEditRes = 'user-password-edit:response',
    UserByIdRes = 'user-by-id:response',
    UserIsSubscribed = 'user-subscribed:response',

    // Events
    EventsReq = 'events:request',
    EventsRes = 'events:response',
    EventsResFav = 'events-favourite:response',
    EventsReqFav = 'events-favourite:request',
    EventsError = 'events:error',
    EventRes = 'event:response',
    EventCreateReq = 'event:create',
    EventCreated = 'event:created',
    EventEditReq = 'event:edit-request',
    EventDelete = 'event:delete',

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
    UnsubscribeReq = 'subscribe:request',
    UnsubscribeRes = 'subscribe:response',
}

export default Events;
