enum Events {
    // Route
    RouteBack = 'route:back',
    RouteUrl = 'route:url',

    // User
    UserRes = 'user:response',
    UserReq = 'user:request',

    // Events
    EventsReq = 'events:request',
    EventsRes = 'events:response',
    EventsError = 'events:error',

    // Authorization
    UserSignup = 'user:signup',
    UserAuthorized = 'user:authorized',
    AuthError = 'auth:error',
    ValidationError = 'validation:error',
    ValidationOk = 'validation:ok',
    SubmitLogin = 'submit:login'
}

export default Events;
