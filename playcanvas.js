import { poll } from './utils.js'
import axios from 'axios'
import arrayToBuffer from 'arraybuffer-to-buffer'
import Zip from 'adm-zip'

// const TOKEN = process.env.PC_TOKEN
// const PROJECT_ID = Number(process.env.PC_PROJECT_ID)
// const CONFIG = { headers: { Authorization: `Bearer ${TOKEN}` } }
const PC_API_ROOT = 'https://playcanvas.com/api'

const asData = ({ data }) => data
export const listBranches = async ({ conf, project_id}) =>
  axios.get(`${PC_API_ROOT}/projects/${project_id}/branches`, conf).then(asData)

export const listScenes = async ({ project_id, conf }) =>
  axios.get(`${PC_API_ROOT}/projects/${project_id}/scenes`, conf).then(asData).then(({ result }) => result)

export const getPrimaryApp = async ({ project_id, conf }) =>
  axios.get(`${PC_API_ROOT}/projects/${project_id}/app`, conf).then(asData)

export const listAssets = async ({ project_id, conf}) =>
  axios.get(`${PC_API_ROOT}/projects/${project_id}/assets`, conf).then(asData)

export const pollJob = async (jobId, conf) => axios.get(`${PC_API_ROOT}/jobs/${jobId}`, conf).then(asData)

export const getBranch = async opts => {
    let optsDefaultBranch = { branch : 'master', ...opts }
    const { result } = await listBranches(optsDefaultBranch)
    return result.filter(({ name }) => name === optsDefaultBranch.branch)[0]
}

export const getLatestVersion = async opts => {
  const { latestCheckpointId } = await getBranch(opts)
  const checkpoint = latestCheckpointId.split('-')[0]
  return checkpoint
}

export const download = ( opts, token ) => {

    return new Promise(async (resolve, reject) => {

        if(!token) throw new Error(`'Token' is undefined`)

        const conf = { headers: { Authorization: `Bearer ${token}` } }
        
        opts.version = opts.version || await getLatestVersion({ ...opts, conf })
        opts.scenes = opts.scenes ? opts.scenes.split(', ').map(scene => parseInt(scene)) : (await listScenes({ ...opts, conf })).map(({ id }) => id)//.join(',')

        console.log(opts)
        const { id } = await axios.post(`${PC_API_ROOT}/apps/download`, opts, conf)
            .then(asData)

        if (id) {
            console.log('Creating build...', id)
            const validateDownload = ({ status }) => status !== 'complete'
            const { download_url } = await poll(async _ => pollJob(id, conf), validateDownload, 1000).then(asData)
            console.log('Downloading build...', opts.version, download_url)

            const data = await axios.get(download_url, { responseType: 'arraybuffer' }).then(asData)
            const buffer = arrayToBuffer(data)
            const file = new Zip(buffer)
            console.log('Download Complete')
            
            resolve({ ...opts, file })
        }
    })
}
