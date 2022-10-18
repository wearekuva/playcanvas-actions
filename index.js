import core from '@actions/core'
import { download } from './playcanvas.js'

try {

    // Define your donwload requirements
    const opts = {
        project_id: parseInt(core.getInput('project-id')),
        name: core.getInput('name') || `playcanvas - ${core.getInput('project-id')}`,
        scenes: core.getInput('scenes'),
        version: core.getInput('version'),
        branch : core.getInput('branch'),
        scripts_concatenate : core.getBooleanInput('concatenate-scripts'),
        scripts_minify : core.getBooleanInput('minify-scripts'),
        optimize_scene_format : core.getBooleanInput('optimize-scene-format'),
        
    }
    
    const engineVersion = core.getInput('engine-version')
    if(engineVersion) opts.engine_version = core.getInput('engine-version')
    
    const excludeIndex = core.getBooleanInput('excludeIndex')

    // Get the PC access token
    const token = core.getInput('playcanvas-access-token')

    // Download the app
    const { name, file, version } = await download(opts, token )
    
    if(excludeIndex) {
        const indexFile = file.getEntry('index.html')
        console.log(indexFile)
        file.deleteFile('index.html')
    }

    // Save the files to the local system
    file.extractAllTo("./", true)

    core.setOutput('name', name)
    core.setOutput('version', version)
    // core.setOutput('path', path);

} catch (error) {

    core.setFailed(error.message);

}
