/** @format */

import React from "react";

const AnalyticsLoader = () => {
  return (
    <div className='analytics_page_loader_section'>
      {/* Header navbar */}
      <div className='analytics_loader_tab'>
        <div className='loader_tab_box skeleton_color'></div>
        <div className='loader_tab_box skeleton_color'></div>
      </div>

      <div className='analytics_chart_section_loader'>
        <div className='chart_loader skeleton_color'></div>
      </div>

      <div className='loader_analyics_grid_box_section'>
        <div className='loader_analytics_grid_box_one skeleton_color'></div>
        <div className='loader_analytics_grid_box_one skeleton_color'></div>
        <div className='loader_analytics_grid_box_one skeleton_color'></div>
        <div className='loader_analytics_grid_box_one skeleton_color'></div>
        <div className='loader_analytics_grid_box_one skeleton_color'></div>
        <div className='loader_analytics_grid_box_one skeleton_color'></div>
      </div>
    </div>
  );
};

export default AnalyticsLoader;
