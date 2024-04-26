dotnet tool list -g > $null
if ($lastExitCode -ne 0) {
  Write-Error "'dotnet tool' not installed, can not validate licenses. Install '.NET Core SDK' to get the 'dotnet tool' command."
  Exit 1
}

$iscBasePath = "../../../"
$licensingToolsPath = "$iscBasePath/Src/Backend/Tools/Licensing"

$output = dotnet-project-licenses -j -i $iscBasePath\InsiteCommerce.sln -u `
            --outfile Licensing\isc-licenses.json `
            --projects-filter $licensingToolsPath\licenses-nuget-project-filter.json `
            --licenseurl-to-license-mappings $licensingToolsPath\licenses-nuget-urlmapping.json `
            --manual-package-information $licensingToolsPath\licenses-manual-references.json `
            --packages-filter $licensingToolsPath\licenses-nuget-package-filter.json `
            --allowed-license-types $licensingToolsPath\licenses-allowed-license-types.json 2>&1

$licenseCheckReturnCode = $lastExitCode

if ($licenseCheckReturnCode -ne 0) {
  Write-Host "dotnet-project-licenses: error: License check failed"
  Write-Host $output

  Exit $licenseCheckReturnCode
}
