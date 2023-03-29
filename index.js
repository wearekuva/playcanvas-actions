import core from '@actions/core'
import { download } from './playcanvas.js'
import { minify } from "terser";

async function minifyFile(file, entry, content, opts){
    const minified = await minify(content, opts)
    file.updateFile(entry, minified)
}

try {

    // Define your donwload requirements
    const opts = {
        project_id: parseInt(core.getInput('project-id')),
        name: core.getInput('name') || `playcanvas - ${core.getInput('project-id')}`,
        scenes: core.getInput('scenes'),
        version: core.getInput('version'),
        branch : core.getInput('branch'),
        scripts_concatenate : core.getBooleanInput('concatenate-scripts'),
        optimize_scene_format : core.getBooleanInput('optimize-scene-format')
    }
    const mangleScripts = core.getBooleanInput('mangle-scripts')
    const minifyScripts = core.getBooleanInput('minify-scripts')
    
    const engineVersion = core.getInput('engine-version')
    if(engineVersion) opts.engine_version = core.getInput('engine-version')
    
    const excludeIndex = core.getBooleanInput('excludeIndex')

    // Get the PC access token
    const token = core.getInput('playcanvas-access-token')

    // Download the app
    const { name, file, version } = await download(opts, token )
    
    if(excludeIndex) {
        // const indexFile = file.getEntry('index.html')
        // console.log(indexFile)
        file.deleteFile('index.html')
    }

    // Minify + mangle
    if(minifyScripts) {
        var zipEntries = file.getEntries();
        zipEntries.forEach(entry => {
            const entryName = entry.entryName
            if (entryName.substr(-3) === ".js") {
                const code = entry.getData().toString("utf8")
                console.log('minifying', entryName, mangleScripts)
                minifyFile(file, entry, code, { mangle : mangleScripts })
                console.log(entry.getData().toString("utf8"))
            }
        });
    }

    // Save the files to the local system
    const dir = core.getInput('dir')
    file.extractAllTo(dir, true)

    core.setOutput('name', name)
    core.setOutput('version', version)
    // core.setOutput('path', path);

} catch (error) {

    core.setFailed(error.message);

}
