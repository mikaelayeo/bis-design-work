/*
  App shell (top header, horizontal menu, footer) for the Assets mockups.
  Markup is the live BIS markup (captured 2026-10-13), trimmed of scripts,
  the hidden profile drawer and system modals. Only "Assets" navigates.
  Usage: BIS_SHELL.mount(pageHtml)
*/
window.BIS_SHELL = (function () {
  const D = window.BIS_DATA;
  const CHEVRON = '<svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" class="css-8mmkcg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>';

  const navItem = (label, icon, href = '#') =>
    `<li><a href="${href}"><i class="fad ${icon}" aria-hidden="true"></i><span class="text_bis">${label}</span></a></li>`;

  const header = () => `
  <div id="mainNav" class="bis_header">
    <div id="this-header" class="navbar-custom page-header-custom">
      <div class="left_side_wrapper">
        <div class="hd_t_lft_ico"><ul class="header_icons_ul"><li class="mob_bars_shw"><a class="widget-sidebar-toggler" href="#"><i class="fa fa-bars"></i></a></li></ul></div>
        <a id="horiz-logo-show" class="navbar-brand-custom no-tooltip" href="asset-list.html" title="${D.portal.name}">
          <div id="logo-container" style="background-image: url('assets/img/logo-qaqc.png')"></div>
        </a>
      </div>
      <div class="right_side_wrapper">
        <div class="hd_t_rght_ser">
          <div class="bis_header_search">
            <form onsubmit="return false">
              <input type="text" class="bis_search_in" placeholder="Search User" name="searchText">
              <div class="bis_search_btn"><span><button type="submit" class="searchButton"><i class="fad fa-search"></i></button></span></div>
            </form>
          </div>
        </div>
        <div class="hd_t_rght">
          <ul class="header_icons_ul">
            <li id="ai-chatbot-header-placeholder">
              <div id="ai-chatbot-floating-wrapper" class="ai-chatbot-floating-wrapper in-header">
                <div id="ai-chatbot-toggle-icon" class="ai-chatbot-floating-icon"><img src="assets/img/ai-chatbot-icon.svg" alt="Chat Icon"></div>
              </div>
            </li>
            <li class="contact_icon" id="contact_button"><a class="header-circle-icon" href="#">?</a></li>
            <li>
              <div class="head_ico_prof">
                <div class="prof_img" style="background-image: url('assets/img/fa-user-user-solid.png'); background-color:#9aa0a6;">
                  <span class="notif_count" id="notif_count"><i class="far fa-envelope"></i></span>
                </div>
              </div>
            </li>
            <li><a id="logout-button" class="logout" href="#"><div class="logOutButton"><span class="logOutText">Log Out </span><i class="fal fa-chevron-right fa-logout"></i></div></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>`;

  const menu = () => `
    <div class="menu_bis ">
      <div class="menu_wrapper">
        <div class="menu_bis_logo_section">
          <a class="navbar-bars widget-sidebar-toggler" id="widget-sidebar-toggler" href="#"><i class="fad fa-bars"></i></a>
        </div>
        <ul class="stroke">
          ${navItem('Home', 'fa-home-lg-alt')}
          ${navItem('Profile', 'fa-user')}
          ${navItem('Store', 'fa-store-alt')}
          ${navItem('Rewards', 'fa-gift')}
          ${navItem('Purchases', 'fa-receipt')}
          ${navItem('Users', 'fa-industry-alt')}
          ${navItem('Reporting', 'fa-chart-bar')}
          ${navItem('Calendar', 'fa-calendar-alt')}
          ${navItem('Assets', 'fa-forklift', 'asset-list.html')}
          ${navItem('Folders', 'fa-folders')}
          ${navItem('QR', 'fa-scanner')}
          ${navItem('Admin', 'fa-users-cog')}
          <li class="vertical-help-wrapper"><a href="#" id="menu-help"><i class="fad fa-info" aria-hidden="true"></i><span class="text_bis">Help</span></a></li>
          <div class="horizontal-help-wrapper"><a id="menu-help"><i class="fad fa-info help-icon-1" aria-hidden="true"></i><span class="text_bis">Help</span></a></div>
        </ul>
      </div>
    </div>`;

  const footer = () => `
  <footer>
    <span><span class="footer-link">Copyright</span> <i class="fad fa-copyright" aria-hidden="true"></i> 2026</span>
    <span><a href="#"><i class="fad fa-file-search" aria-hidden="true"></i> <span class="footer-link">Privacy Policy</span></a></span>
    <span><a href="#"><i class="fad fa-file-contract" aria-hidden="true"></i> <span class="footer-link">Terms and Conditions</span></a></span>
    <span><a href="#"><i class="fad fa-phone-laptop" aria-hidden="true"></i> <span class="footer-link">System Requirements</span></a></span>
    <span><a href="#"><i class="fad fa-money-check-alt" aria-hidden="true"></i> <span class="footer-link">Pay Online</span></a></span>
    <span><a href="#"><i class="fad fa-file-certificate" aria-hidden="true"></i> <span class="footer-link">Certificate Verification</span></a></span>
    <span><a href="#"><i class="fad fa-receipt" aria-hidden="true"></i> <span class="footer-link">Credit Card Receipt Lookup</span></a></span>
  </footer>`;

  function mount(pageHtml) {
    document.body.innerHTML = `
<div id="layout-wrapper">
  ${header()}
  <div id="layout-wrapper-sub" class="horizontal_menu">
    ${menu()}
    <div class="content ">
      <div class="content_wrapper">
        <div id="reactRoot">${pageHtml}</div>
      </div>
      <div id="reactRootAdvanceDocumentation"></div>
    </div>
  </div>
  ${footer()}
</div>`;
    // Inert links: keep the prototype on the three screens.
    document.querySelectorAll('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

    // Prototype-only control (not part of the product UI): undo every change made in these screens
    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'proto-reset';
    reset.innerHTML = '<i class="fas fa-undo-alt" aria-hidden="true"></i> Reset prototype';
    reset.title = 'Undo every move, deactivation, edit and new asset made in these screens';
    reset.addEventListener('click', () => {
      D.resetStore();
      if (window.BIS_UI) BIS_UI.flash('Prototype reset. The sample data is back to the start.');
      const id = new URLSearchParams(location.search).get('id') || '';
      // a newly created asset no longer exists after a reset, so go back to the list
      if (/asset-view\.html$/.test(location.pathname) && id.startsWith('n')) location.href = 'asset-list.html';
      else location.reload();
    });
    document.body.appendChild(reset);
  }

  return { mount, CHEVRON };
})();
