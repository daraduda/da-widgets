function changeSelectedTab(selectedTabName){
	$(".tab").removeClass("selected");
		
	if(selectedTabName == "new") {
		$(".tab.new").addClass("selected");

		$(".content-links.new").show();
		$(".content-links.used").hide();
		$(".content-links.cpo").hide();
		
		$(".browse-tree-content-three.new").show();
		$(".browse-tree-content-three.used").hide();
		$(".browse-tree-content-three.cpo").hide();
	} else if(selectedTabName == "used") {
		$(".tab.used").addClass("selected");

		$(".content-links.used").show();
		$(".content-links.new").hide();
		$(".content-links.cpo").hide();

		$(".browse-tree-content-three.used").show();
		$(".browse-tree-content-three.new").hide();
		$(".browse-tree-content-three.cpo").hide();
	} else if(selectedTabName == "cpo") {
		$(".tab.cpo").addClass("selected");

		$(".content-links.cpo").show();
		$(".content-links.new").hide();
		$(".content-links.used").hide();

		$(".browse-tree-content-three.cpo").show();
		$(".browse-tree-content-three.new").hide();
		$(".browse-tree-content-three.used").hide();
	}
}