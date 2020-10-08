import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`

  body,
  div.ui.grid.balances-container,
  .post__content,
  .read-next-div {
    background: ${({ theme }) => theme.body};
  }

  h1, h2, h3, h4, h5, p, 
  .table-header-text,
  .table-header-text-1,
  .table-header-text-2,
  .table-body-text-1,
  .table-body-text-2.games
  .blogdetail-page-container .post__content li,
  i.twitter.square.icon.share-icon,
  i.facebook.icon.share-icon,
  i.linkedin.icon.share-icon,
  #mobile-menu-icon {
    color: ${({ theme }) => theme.text} !important;
  }

  .home-dashboard-p,
  .home-dashboard-mission,
  .home-dashboard-h2,
  .featured-casino-text,
  .home-dashboard-h1 {
    color: ${({ theme }) => theme.homeText} !important;  
  }

  .games-container,
  .nft-container,
  .balances-column,
  .table-body,
  .featured-blog-container,
  .post,
  .DG-column,
  .read-next-button:first-child,
  .read-next-button:last-child,
  .admin-balances-column {
    background: ${({ theme }) => theme.card};
    border: ${({ theme }) => theme.cardBorder};
    box-shadow: ${({ theme }) => theme.boxShadow};
  }

  a.ui.button.read-next-button {
    background: ${({ theme }) => theme.card} !important;
    color: ${({ theme }) => theme.text} !important;
  }

  .welcome-text,
  .earned-text,
  .read-next-button:first-child:before,
  .read-next-button:last-child:before {
    color: ${({ theme }) => theme.offColorText} !important;   
  }

  .featured-blog-grid {
    background: ${({ theme }) => theme.card};
  }

  .menu-container-dark.blog,
  .other-menu-container.blog,
  .ui.visible.top.overlay.sidebar,
  div.ui.vertical.labeled.icon.ui.overlay.top.sidebar.menu {
    background: ${({ theme }) => theme.menuColor} !important;
    box-shadow: ${({ theme }) => theme.boxShadow};
  }

  div#home-mobile-background.ui.vertical.labeled.icon.ui.overlay.top.sidebar.menu {
    background: ${({ theme }) => theme.homeMenuColor} !important;
    box-shadow: ${({ theme }) => theme.homeBoxShadow};
    border-bottom: ${({ theme }) => theme.homeDivider};
  }

  .ui.visible.top.overlay.sidebar,
  div.ui.vertical.labeled.icon.ui.overlay.top.sidebar.menu {
    border-bottom: ${({ theme }) => theme.globalDividers};
  }

  .sidebar-menu-text.blog.active,
  .sidebar-menu-text.blog:hover,
  .account-hover.active,
  .account-hover:hover {
    color: ${({ theme }) => theme.text} !important;
  }

  .sidebar-menu-text.blog,
  .account-hover {
    color: ${({ theme }) => theme.menuText} !important;
  }

  .ui.divider {
    border-top: ${({ theme }) => theme.globalDividers} !important;
  }

  .gameplay-left-column {
    border-right: ${({ theme }) => theme.globalDividers};
  }

  table {
    border: ${({ theme }) => theme.globalDividers} !important;
    box-shadow: ${({ theme }) => theme.boxShadow}; 
  }

  .table-body-text-1.first,
  .table-body-text-1,
  .table-body-text-2, 
  .table-body-text-2.games {
    border-bottom: ${({ theme }) => theme.globalDividers};
  }

  .nfts-info,
  .nfts-info-2,
  .table-header,
  .blog-date,
  .blog-category,
  .post-date,
  .post-category,
  .post-date-blogdetail{
    background: ${({ theme }) => theme.infoColor};
    color: ${({ theme }) => theme.text} !important;
  }

  code strong, kbd, samp {
    background: ${({ theme }) => theme.codeHighlight};
    color: ${({ theme }) => theme.text} !important;
    border: ${({ theme }) => theme.codeHighlightBorder};
  }
`;