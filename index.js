import core from '@actions/core'
import { download } from './playcanvas.js'

try {

    // Define your donwload requirements
    const opts = {
        project_id: parseInt(core.getInput('project-id')),
        name: core.getInput('name') || `playcanvas - ${core.getInput('project-id')}`,
        scenes: core.getInput('scenes'),
        version: core.getInput('version'),
        branch: core.getInput('branch'),
        concatenateScripts: core.getBooleanInput('concatenate-scripts'),
        minifyScripts: core.getBooleanInput('minify-scripts'),
        optimizeSceneFormat: core.getBooleanInput('optimize-scene-format'),
        
    }
    
    const excludes = core.getBooleanInput('excludeIndex')

    // Get the PC access token
    const token = core.getInput('playcanvas-access-token')

    // Download the app
    const { name, file, version } = await download(opts, token )
    
    if(excludeIndex) file.deleteFile(file.getEntry('./index.js'))

    // Save the files to the local system
    file.extractAllTo("./", true)

    core.setOutput('name', name)
    core.setOutput('version', version)
    // core.setOutput('path', path);

} catch (error) {

    core.setFailed(error.message);

}
