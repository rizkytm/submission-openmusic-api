const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
    // options: {
    //   auth: 'openmusicapp_jwt',
    // },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
    // options: {
    //   auth: 'openmusicapp_jwt',
    // },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
    // options: {
    //   auth: 'openmusicapp_jwt',
    // },
  },
];

module.exports = routes;
