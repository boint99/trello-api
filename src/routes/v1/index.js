import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { columnRoute } from '~/routes/v1/columnRoute'
import { cardRoute } from '~/routes/v1/cardRoute'


const Router = express.Router()

// check api v1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use.' })
})

// Board router APIs
Router.use('/boards', boardRoute )

// Column router APIs
Router.use('/columns', columnRoute )


// Card router APIs
Router.use('/cards', cardRoute )


export const APIs_V1 = Router