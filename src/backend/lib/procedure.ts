import { IpcMainInvokeEvent } from 'electron'
import { z } from 'zod'
import { Api } from '../../shared/api'

// On définit un type de handler précis au lieu de 'Function'
// TInput est ce que Zod valide, TReturn est ce que le service renvoie
type ProcedureHandler<TInput, TReturn> = (
  input: TInput,
  event: IpcMainInvokeEvent
) => Promise<TReturn>

export const procedure = {
  input: <T extends z.ZodType>(schema: T) => ({
    // On lie le type du handler au schéma Zod passé en entrée
    query: <TReturn>(handler: ProcedureHandler<z.infer<T>, TReturn>) => handle(schema, handler),
    mutation: <TReturn>(handler: ProcedureHandler<z.infer<T>, TReturn>) => handle(schema, handler)
  })
}

// La fonction handle est maintenant typée de manière à ce que 'input' soit automatiquement inféré à partir du schéma Zod
const handle = <T extends z.ZodType, TReturn>(
  schema: T,
  handler: ProcedureHandler<z.infer<T>, TReturn>
) => {
  return async (event: IpcMainInvokeEvent, rawInput: unknown) => {
    try {
      // Validation Zod : 'input' est maintenant automatiquement typé selon le schéma
      const input = schema.parse(rawInput)

      // Appel du handler : plus besoin de 'as AsyncAction' !
      // TypeScript sait maintenant que handler prend 'input' et 'event'
      const result = await handler(input, event)

      return Api.success(result)
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        return Api.error('Validation Error', 'VALIDATION_FAILED', err.issues)
      }
      const message = err instanceof Error ? err.message : 'Unknown error'
      return Api.error(message, 'SERVER_ERROR')
    }
  }
}
