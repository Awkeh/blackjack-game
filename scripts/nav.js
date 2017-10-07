function goto(target)
{
	var child = document.getElementsByTagName("section");
			target = document.getElementById(target);

	for( n = 0; n < child.length; n++ )
	{
		if(child[n].classList.contains("active"))
			child[n].classList.remove("active");
	}
	target.classList.add("active");
}

function setTableColor(sample)
{
	document.body.classList = sample.classList;
}

function msg(str)
{
	var box = document.getElementById("modal-box");
	box.innerHTML = str;
	box.classList.add("in");
	setTimeout(function()
{
	box.classList.remove("in");
}, 3000);
}
