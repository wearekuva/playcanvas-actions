import core from '@actions/core'
import artifact from '@actions/artifact'
import { writeFile } from "fs"
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
        optiomizeSceneFormat: core.getBooleanInput('optimize-scene-format'),
        
    }

    // Get the PC access token
    const token = core.getInput('playcanvas-access-token')

    // Download the app
    const { name, data, version } = await download(opts, token )

    // Save the file to the local system
    const path = `./${name}-${version}.zip`
    writeFile(path, data)

    console.log('File Save complete')

    // Upload the file as an artifact
    const artifactClient = artifact.create()
    const { artifactName } = await artifactClient.uploadArtifact(`${name}-${version}`, [path], '/')

    core.setOutput('name', artifactName);

} catch (error) {

    core.setFailed(error.message);

}