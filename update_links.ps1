$files = Get-ChildItem -Path "c:\work\WEBSITE - Atla Manpower\*.html" -File

foreach ($file in $files) {
    if ($file.Name -eq "index.html" -or $file.Name -eq "happy-clients.html") {
        continue
    }

    $content = Get-Content $file.FullName -Raw

    # Update Navbar
    $contactNavTarget = '<li><a href="contact.html" class="btn btn-primary btn-sm">Contact Us</a></li>'
    $contactNavReplacement = "<li><a href=`"happy-clients.html`">Happy Clients</a></li>`r`n                <li><a href=`"contact.html`" class=`"btn btn-primary btn-sm`">Contact Us</a></li>"
    
    $content = $content.Replace($contactNavTarget, $contactNavReplacement)

    # Update Footer
    $contactFooterTarget = '<li><a href="contact.html">Contact</a></li>'
    $contactFooterReplacement = "<li><a href=`"happy-clients.html`">Happy Clients</a></li>`r`n                    <li><a href=`"contact.html`">Contact</a></li>"
    
    $content = $content.Replace($contactFooterTarget, $contactFooterReplacement)

    Set-Content -Path $file.FullName -Value $content
}

Write-Output "Links updated successfully!"
