import AuditLog from '../model/auditLog.model.js'

export const audit = (action, getResource = (req) => null, getMeta = (req) => null) => {
  return async (req, res, next) => {
    // run after response using finish event
    res.on('finish', async () => {
      try {
        await AuditLog.create({
          actorUserId: req.user?.id,
          action,
          resource: getResource(req),
          meta: getMeta(req),
          ip: req.ip,
          userAgent: req.headers['user-agent']
        })
      } catch (e) {
        // swallow audit errors
      }
    })
    next()
  }
}



